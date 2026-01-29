import { Response, NextFunction } from 'express';
import Content from '../models/Content.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Create Content
export const createContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, title, content, imageUrl, order, metadata } = req.body;

    const newContent = await Content.create({
      type,
      title,
      content,
      imageUrl,
      order,
      metadata,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { content: newContent },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get All Content
export const getAllContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, isActive } = req.query;

    const query: any = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const contents = await Content.find(query)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { contents },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Active Content (Public)
export const getActiveContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query;

    const query: any = { isActive: true };
    if (type) query.type = type;

    const contents = await Content.find(query)
      .select('-createdBy')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: { contents },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Update Content
export const updateContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { contentId } = req.params;
    const updateData = req.body;

    const content = await Content.findByIdAndUpdate(
      contentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!content) {
      return next(new AppError('Content not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { content },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Delete Content
export const deleteContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { contentId } = req.params;

    const content = await Content.findByIdAndDelete(contentId);

    if (!content) {
      return next(new AppError('Content not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
