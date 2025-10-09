-- ===================================================================
-- 018: waitlist_submissions に任意アンケート用カラムを追加
-- ===================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'industry'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN industry TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN company_name TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'job_role'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN job_role TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'pain_points'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN pain_points TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'expectations'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN expectations TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'budget'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN budget TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'preferred_business_model'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN preferred_business_model TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'business_model_choice'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN business_model_choice TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'preferred_people'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN preferred_people TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'content_intent'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN content_intent TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'free_text'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN free_text TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'interview_opt_in'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN interview_opt_in BOOLEAN;
  END IF;
END $$;


