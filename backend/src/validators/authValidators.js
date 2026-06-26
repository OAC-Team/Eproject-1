const { z } = require('zod');

const UserShema = z.object({
    username: z
        .string({ required_error: 'Username cannot be empty!' })
        .min(6, 'Username must be at least 6 characters!')
        .max(20, 'Username maximum 20 characters!')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters!'),

    email: z
        .string({ required_error: 'Email cannot be empty!' })
        .email('Invalid email format')
        .trim()
        .toLowerCase(),

    password_hash: z
        .string({ required_error: 'Password cannot be empty!' })
        .min(8, 'Password must be at least 8 characters!')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter!')
        .regex(/[0-9]/, 'Password must contain at least one digit!'),

    comfirmPassword: z.string({ required_error: 'Please confirm password!' })

}).refine((data) => data.password_hash === data.comfirmPassword, {
    message: 'Confirmation password does not match!',
    path: ['comfirmPassword'],
});

const LoginSchema = z.object({
    email: z.string().email('Invalid email format!').optional(),
    username: z.string().optional(),
    password_hash: z.string().min(1, 'Password cannot be empty!'),
    rememberMe: z.boolean().default(false).optional()
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({
            success: false,
            errors: result.error.issues.map(issues => ({
                field: issues.path[0],
                message: issues.message
            }))
        });
    }
    req.body = result.data;
    next();
};

const validateRegister = validate(UserShema);
const validateLogin = validate(LoginSchema);

module.exports = { validateRegister, validateLogin }