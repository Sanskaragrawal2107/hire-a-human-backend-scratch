-- SQL triggers will live here.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


CREATE TRIGGER trigger_engineers_updated_at
BEFORE UPDATE ON engineers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recruiters_updated_at
BEFORE UPDATE ON recruiters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE INDEX idx_engineers_curr_location 
    ON engineers(curr_location);

CREATE INDEX idx_engineers_experience_years 
    ON engineers(experience_years);

CREATE INDEX idx_engineers_job_type 
    ON engineers(job_type);

CREATE INDEX idx_engineers_is_open_to_hire 
    ON engineers(is_open_to_hire);

CREATE INDEX idx_recruiters_verification_status 
    ON recruiters(verification_status);

CREATE INDEX idx_engineers_skills 
    ON engineers USING GIN(skills);

CREATE INDEX idx_engineers_location_experience 
    ON engineers(curr_location, experience_years);