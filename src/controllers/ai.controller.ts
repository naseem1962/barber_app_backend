import { Response, NextFunction } from 'express';
import OpenAI from 'openai';
import Appointment from '../models/Appointment.model';
import User from '../models/User.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

/** Lazy OpenAI client – uses env at runtime so no key is ever in source. */
function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new AppError('OPENAI_API_KEY is not configured', 503);
  return new OpenAI({ apiKey: key });
}

// AI Hairstyle Recommendation
export const getHairstyleRecommendation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { faceShape, hairType, hairDensity, imageUrl } = req.body;

    // Get user data if available
    let userData = {};
    if (req.user) {
      const user = await User.findById(req.user._id);
      userData = {
        faceShape: user?.faceShape,
        hairType: user?.hairType,
        hairDensity: user?.hairDensity,
      };
    }

    const prompt = `Based on the following information, recommend the best haircut and beard styles:
    Face Shape: ${faceShape || userData.faceShape || 'not specified'}
    Hair Type: ${hairType || userData.hairType || 'not specified'}
    Hair Density: ${hairDensity || userData.hairDensity || 'not specified'}
    
    Provide 3-5 specific hairstyle recommendations with descriptions and why they work for this person. Also suggest beard styles if applicable.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert hairstylist and barber with years of experience. Provide detailed, personalized recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const recommendations = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        analysis: {
          faceShape: faceShape || userData.faceShape,
          hairType: hairType || userData.hairType,
          hairDensity: hairDensity || userData.hairDensity,
        },
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || 'AI service error', 500));
  }
};

// Predict No-Show Probability
export const predictNoShow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'name email');

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    // Get user's appointment history
    const userAppointments = await Appointment.find({
      user: appointment.user,
    });

    const noShowCount = userAppointments.filter(
      (apt) => apt.status === 'no_show'
    ).length;
    const totalAppointments = userAppointments.length;
    const noShowRate = totalAppointments > 0 ? (noShowCount / totalAppointments) * 100 : 0;

    // Simple prediction algorithm (can be enhanced with ML)
    let probability = noShowRate;
    
    // Adjust based on confirmation status
    if (!appointment.confirmationReceived) {
      probability += 20;
    }

    // Adjust based on time until appointment
    const hoursUntil = (appointment.appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 24) {
      probability += 10;
    }

    probability = Math.min(probability, 100);

    appointment.noShowProbability = probability;
    await appointment.save();

    res.status(200).json({
      success: true,
      data: {
        appointmentId: appointment._id,
        noShowProbability: probability,
        recommendation: probability > 50 ? 'Consider sending reminder and confirmation request' : 'Low risk',
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// AI Pricing Assistant
export const getPricingRecommendation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceDuration, skillLevel, isPeakHour, dayOfWeek } = req.body;

    const prompt = `As a pricing expert for barber services, recommend a price for:
    Service Duration: ${serviceDuration} minutes
    Barber Skill Level: ${skillLevel || 'intermediate'}
    Peak Hour: ${isPeakHour ? 'Yes' : 'No'}
    Day of Week: ${dayOfWeek || 'weekday'}
    
    Provide a recommended price range and reasoning.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a pricing expert for barber and salon services.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
    });

    const recommendation = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        recommendation,
        factors: {
          serviceDuration,
          skillLevel,
          isPeakHour,
          dayOfWeek,
        },
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || 'AI service error', 500));
  }
};

// AI Business Coach Insights
export const getBusinessInsights = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get barber's appointments and earnings data
    const appointments = await Appointment.find({
      barber: req.user._id,
      status: 'completed',
    })
      .populate('user', 'name')
      .sort({ appointmentDate: -1 })
      .limit(100);

    // Analyze data
    const totalEarnings = appointments.reduce(
      (sum, apt) => sum + apt.service.price,
      0
    );

    const earningsByDay: Record<string, number> = {};
    appointments.forEach((apt) => {
      const day = apt.appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
      earningsByDay[day] = (earningsByDay[day] || 0) + apt.service.price;
    });

    const bestDay = Object.entries(earningsByDay).sort((a, b) => b[1] - a[1])[0];

    const prompt = `Based on this barber's business data, provide insights and recommendations:
    Total Completed Appointments: ${appointments.length}
    Total Earnings: $${totalEarnings}
    Best Earning Day: ${bestDay ? `${bestDay[0]} ($${bestDay[1]})` : 'N/A'}
    
    Provide actionable business insights and recommendations.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a business coach specializing in barber shop management and growth strategies.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 400,
    });

    const insights = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        insights,
        statistics: {
          totalAppointments: appointments.length,
          totalEarnings,
          bestDay,
        },
      },
    });
  } catch (error: any) {
    next(new AppError(error.message || 'AI service error', 500));
  }
};
