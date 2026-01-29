# Fix GitHub Push Blocked by Secret (GH013)

GitHub Push Protection blocks the push because **commit 4f78eaa** (or another commit in your history) once contained an OpenAI API key at `src/controllers/ai.controller.ts` line 10.

The code is now fixed (no hardcoded key; OpenAI client is created lazily from env). You still need to **remove the secret from git history** so the push no longer contains it.

---

## Option A: If the bad commit is your **latest** commit

Run this from the **backend** folder (or repo root if backend is the whole repo):

```bash
cd backend
git reset --soft HEAD~1
git add src/controllers/ai.controller.ts
git commit -m "AI: use env for OpenAI key (no secrets in code)"
git push origin main
```

This replaces the last commit with a new one that has the safe code. No force push needed if you haven’t pushed that commit yet; if you already pushed the bad commit, use:

```bash
git push origin main --force
```

(**Only** use `--force` if you’re sure no one else is using this branch.)

---

## Option B: If the bad commit is **not** the latest (history rewrite)

You need to rewrite history so that commit no longer contains the secret.

1. Find the commit hash (e.g. `4f78eaa`).
2. Start an interactive rebase **before** that commit:
   ```bash
   git rebase -i 4f78eaa^
   ```
3. In the editor, change the line for `4f78eaa` from `pick` to `edit`, save and close.
4. When Git stops at that commit, replace the file with the current safe version:
   ```bash
   git checkout HEAD -- src/controllers/ai.controller.ts
   git add src/controllers/ai.controller.ts
   git commit --amend --no-edit
   git rebase --continue
   ```
5. Force push:
   ```bash
   git push origin main --force
   ```

---

## Option C: Allow the secret once (if key was fake or already rotated)

If the “secret” was a test key you’ve already deleted, or a false positive:

1. Open the link from the error:
   `https://github.com/naseem1962/barber_app_backend/security/secret-scanning/unblock-secret/...`
2. Choose “Allow secret” / “I’ve rotated the key” so GitHub allows the push **this time**.
3. **Important:** If it was a real key, rotate it in the OpenAI dashboard first; the old key will stay in history until you use Option A or B.

---

## After fixing

- Never commit real API keys. Use **Environment Variables** (e.g. in Vercel, GitHub Actions, or `.env` locally; keep `.env` in `.gitignore`).
- The backend now reads `OPENAI_API_KEY` only at runtime in `ai.controller.ts`; no key is stored in source.
