-- ===================================================================
-- 019: 予算レンジ用カラム追加
-- ===================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'budget_min'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN budget_min INTEGER;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'budget_max'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN budget_max INTEGER;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'waitlist_submissions' AND column_name = 'budget_period'
  ) THEN
    ALTER TABLE waitlist_submissions ADD COLUMN budget_period TEXT CHECK (budget_period IN ('monthly','per_project','other'));
  END IF;
END $$;


