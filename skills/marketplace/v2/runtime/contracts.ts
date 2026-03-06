import fs from 'fs';
import path from 'path';

export type JsonSchema = {
    type?: string | string[];
    properties?: Record<string, JsonSchema>;
    required?: string[];
    items?: JsonSchema;
    enum?: Array<string | number | boolean | null>;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    additionalProperties?: boolean;
};

export type ValidationResult = {
    valid: boolean;
    errors: string[];
};

export type SkillPackageSpec = {
    packageVersion: string;
    schemaVersion: number;
    skill: {
        id: number;
        name: string;
        title: string;
        domain: string;
        verticalId: string;
        verticalName: string;
        method: string;
        archetype: string;
    };
    contracts: {
        inputSchemaPath: string;
        outputSchemaPath: string;
    };
    quality: {
        score: number;
        roiScore: number;
        trustBadges: string[];
    };
    references: {
        implementationPath: string;
        sourceMarketplacePath: string;
    };
};

function valueType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

function isTypeMatch(value: unknown, expected: string | string[] | undefined): boolean {
    if (!expected) return true;
    const options = Array.isArray(expected) ? expected : [expected];
    const actual = valueType(value);
    return options.includes(actual);
}

function validateNumber(value: number, schema: JsonSchema, pointer: string, errors: string[]) {
    if (typeof schema.minimum === 'number' && value < schema.minimum) {
        errors.push(`${pointer}: number ${value} < minimum ${schema.minimum}`);
    }
    if (typeof schema.maximum === 'number' && value > schema.maximum) {
        errors.push(`${pointer}: number ${value} > maximum ${schema.maximum}`);
    }
}

function validateString(value: string, schema: JsonSchema, pointer: string, errors: string[]) {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
        errors.push(`${pointer}: string length ${value.length} < minLength ${schema.minLength}`);
    }
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
        errors.push(`${pointer}: string length ${value.length} > maxLength ${schema.maxLength}`);
    }
}

function validateSchemaInternal(value: unknown, schema: JsonSchema, pointer: string, errors: string[]) {
    if (!isTypeMatch(value, schema.type)) {
        errors.push(`${pointer}: expected type ${JSON.stringify(schema.type)}, got ${valueType(value)}`);
        return;
    }

    if (schema.enum && !schema.enum.includes(value as never)) {
        errors.push(`${pointer}: value not in enum`);
        return;
    }

    if (valueType(value) === 'number') {
        validateNumber(value as number, schema, pointer, errors);
    }

    if (valueType(value) === 'string') {
        validateString(value as string, schema, pointer, errors);
    }

    if (Array.isArray(value) && schema.items) {
        for (let index = 0; index < value.length; index += 1) {
            validateSchemaInternal(value[index], schema.items, `${pointer}[${index}]`, errors);
        }
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        const required = schema.required || [];
        for (const key of required) {
            if (!(key in record)) {
                errors.push(`${pointer}: missing required property \"${key}\"`);
            }
        }

        const properties = schema.properties || {};
        for (const [key, propertySchema] of Object.entries(properties)) {
            if (key in record) {
                validateSchemaInternal(record[key], propertySchema, `${pointer}.${key}`, errors);
            }
        }

        if (schema.additionalProperties === false) {
            for (const key of Object.keys(record)) {
                if (!(key in properties)) {
                    errors.push(`${pointer}: additional property not allowed \"${key}\"`);
                }
            }
        }
    }
}

export function validateSchema(value: unknown, schema: JsonSchema): ValidationResult {
    const errors: string[] = [];
    validateSchemaInternal(value, schema, '$', errors);
    return {
        valid: errors.length === 0,
        errors
    };
}

export function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function loadSkillPackageSpec(packageDir: string): SkillPackageSpec {
    const specPath = path.join(packageDir, 'skill.json');
    if (!fs.existsSync(specPath)) {
        throw new Error(`Missing skill.json at ${specPath}`);
    }
    return loadJson<SkillPackageSpec>(specPath);
}

export function readContractSchemas(spec: SkillPackageSpec, packageDir: string) {
    const inputSchemaPath = path.join(packageDir, spec.contracts.inputSchemaPath);
    const outputSchemaPath = path.join(packageDir, spec.contracts.outputSchemaPath);

    if (!fs.existsSync(inputSchemaPath)) {
        throw new Error(`Missing input schema: ${inputSchemaPath}`);
    }
    if (!fs.existsSync(outputSchemaPath)) {
        throw new Error(`Missing output schema: ${outputSchemaPath}`);
    }

    return {
        inputSchema: loadJson<JsonSchema>(inputSchemaPath),
        outputSchema: loadJson<JsonSchema>(outputSchemaPath)
    };
}
