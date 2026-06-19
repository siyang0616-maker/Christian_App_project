# Supabase SQL: Leader Prayer Care Marks

## Purpose

This SQL adds the leader-only prayer care marks table.

Leaders can classify prayer requests as:

- `함께 기도`
- `개별 돌봄`
- `중요`
- `계속 기억`

Members cannot read these leader-only classification marks.

## When To Run

Run this once in Supabase SQL Editor before testing the new leader care mark buttons.

## SQL File

Use:

```text
supabase/migrations/004_leader_prayer_care_marks.sql
```

## Steps

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Paste the full contents of `supabase/migrations/004_leader_prayer_care_marks.sql`.
4. Run the query.
5. Return to `/leader`.
6. Test one prayer card:
   - choose `함께 기도` or `개별 돌봄`
   - toggle `중요`
   - toggle `계속 기억`
   - press `돌봄 표시 저장`

## Expected Result

The leader dashboard should show the saved care labels after redirecting back to the prayer timeline.

## Privacy Check

Do not add member-facing reads for `leader_prayer_care_marks`.

This table is intentionally leader-only because care labels can feel like monitoring if exposed to members.
