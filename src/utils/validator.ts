import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export function createValidator(schema: object) {
  const validate = ajv.compile(schema);

  return function validateData(data: unknown): void {
    const valid = validate(data);
    if (!valid) {
      const errors = validate.errors
        ?.map((e) => `  - ${e.instancePath || "root"}: ${e.message}`)
        .join("\n");
      throw new Error(`Schema validation failed:\n${errors}`);
    }
  };
}
