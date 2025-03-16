ALTER TABLE "Slots"
ADD CONSTRAINT no_date_overlap
EXCLUDE USING GIST (
  tsrange(start_time, end_time, '()') WITH &&
);
