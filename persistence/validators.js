import {
  parse,
  object,
  string,
  boolean,
  optional,
  nullable,
  array,
  union,
  date,
  regex,
  transform,
  custom,
  pipe,
  minLength
} from 'valibot';

const nonEmptyString = (message) =>
  pipe(
    string(),
    custom((val) => val !== undefined && val !== null && val !== '', message),
    minLength(1, message)
  );

const isoDateString = union([
  pipe(
    string('Invalid ISO date format'),
    regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
      'Invalid ISO date format'
    )
  ),
  transform((d) => d.toISOString()),
  date()
]);

const Task = object({
  id: nonEmptyString('Task ID is required'),
  name: nonEmptyString('Name cannot be empty'),
  done: optional(boolean())
});

const User = object({
  displayName: nonEmptyString('Display name cannot be empty'),
  tasks: array(Task),
  dateOfBirth: optional(
    nullable(
      pipe(
        isoDateString,
        custom(
          (value) => new Date(value) < new Date(),
          'Date of birth must be in the past'
        )
      )
    )
  )
});

function validate (schema, value) {
  return parse(schema, value);
}

export { validate, Task, User };
