const Joi = require('joi');

/**
 * Validation schemas for DeFi endpoints
 * Following best practices for input sanitization and security
 */

// Ethereum address validation pattern
const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

// Common token symbols that are allowed
const ALLOWED_TOKENS = [
  'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC',
  'Lumeris', 'GAME', 'MATIC', 'AVAX', 'SOL', 'BNB', 'LINK'
];

/**
 * Swap transaction validation schema
 * Validates all required fields with appropriate constraints
 */
const swapSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'string.min': 'User ID must be at least 1 character',
      'string.max': 'User ID cannot exceed 100 characters',
      'any.required': 'User ID is required'
    }),

  tokenIn: Joi.string()
    .trim()
    .uppercase()
    .valid(...ALLOWED_TOKENS)
    .required()
    .messages({
      'string.empty': 'Input token is required',
      'any.only': `Input token must be one of: ${ALLOWED_TOKENS.join(', ')}`,
      'any.required': 'Input token is required'
    }),

  tokenOut: Joi.string()
    .trim()
    .uppercase()
    .valid(...ALLOWED_TOKENS)
    .required()
    .messages({
      'string.empty': 'Output token is required',
      'any.only': `Output token must be one of: ${ALLOWED_TOKENS.join(', ')}`,
      'any.required': 'Output token is required'
    }),

  amountIn: Joi.number()
    .positive()
    .precision(18) // Max precision for most tokens
    .max(1e15) // Reasonable upper limit to prevent overflow
    .required()
    .messages({
      'number.base': 'Amount in must be a valid number',
      'number.positive': 'Amount in must be greater than 0',
      'number.max': 'Amount in exceeds maximum allowed value',
      'any.required': 'Amount in is required'
    }),

  amountOutMin: Joi.number()
    .positive()
    .precision(18)
    .max(1e15)
    .optional()
    .messages({
      'number.base': 'Minimum amount out must be a valid number',
      'number.positive': 'Minimum amount out must be greater than 0',
      'number.max': 'Minimum amount out exceeds maximum allowed value'
    }),

  walletAddress: Joi.string()
    .trim()
    .pattern(ethereumAddressPattern)
    .required()
    .messages({
      'string.empty': 'Wallet address is required',
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required'
    }),

  slippage: Joi.number()
    .min(0.1)
    .max(50) // Max 50% slippage
    .precision(2)
    .optional()
    .default(1)
    .messages({
      'number.base': 'Slippage must be a valid number',
      'number.min': 'Slippage must be at least 0.1%',
      'number.max': 'Slippage cannot exceed 50%'
    })
}).options({
  stripUnknown: true, // Remove unknown fields for security
  abortEarly: false // Return all validation errors
}).custom((value, helpers) => {
  // Custom validation to ensure tokenIn and tokenOut are different
  if (value.tokenIn && value.tokenOut && value.tokenIn === value.tokenOut) {
    return helpers.message('Output token must be different from input token');
  }
  return value;
});

/**
 * Liquidity operation validation schema
 */
const liquiditySchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    }),

  token0Amount: Joi.number()
    .positive()
    .precision(18)
    .max(1e15)
    .required()
    .messages({
      'number.base': 'Token 0 amount must be a valid number',
      'number.positive': 'Token 0 amount must be greater than 0',
      'any.required': 'Token 0 amount is required'
    }),

  token1Amount: Joi.number()
    .positive()
    .precision(18)
    .max(1e15)
    .required()
    .messages({
      'number.base': 'Token 1 amount must be a valid number',
      'number.positive': 'Token 1 amount must be greater than 0',
      'any.required': 'Token 1 amount is required'
    }),

  walletAddress: Joi.string()
    .trim()
    .pattern(ethereumAddressPattern)
    .required()
    .messages({
      'string.empty': 'Wallet address is required',
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required'
    })
}).options({
  stripUnknown: true,
  abortEarly: false
});

/**
 * Remove liquidity validation schema
 */
const removeLiquiditySchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    }),

  lpTokens: Joi.number()
    .positive()
    .precision(18)
    .max(1e15)
    .required()
    .messages({
      'number.base': 'LP tokens amount must be a valid number',
      'number.positive': 'LP tokens amount must be greater than 0',
      'any.required': 'LP tokens amount is required'
    }),

  walletAddress: Joi.string()
    .trim()
    .pattern(ethereumAddressPattern)
    .required()
    .messages({
      'string.empty': 'Wallet address is required',
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required'
    })
}).options({
  stripUnknown: true,
  abortEarly: false
});

/**
 * Staking validation schema
 */
const stakingSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    }),

  amount: Joi.number()
    .positive()
    .precision(18)
    .max(1e15)
    .required()
    .messages({
      'number.base': 'Amount must be a valid number',
      'number.positive': 'Amount must be greater than 0',
      'any.required': 'Amount is required'
    }),

  walletAddress: Joi.string()
    .trim()
    .pattern(ethereumAddressPattern)
    .required()
    .messages({
      'string.empty': 'Wallet address is required',
      'string.pattern.base': 'Invalid Ethereum wallet address format',
      'any.required': 'Wallet address is required'
    }),

  lockPeriod: Joi.string()
    .valid('7 days', '30 days', '90 days', '180 days', '365 days')
    .optional()
    .default('30 days')
    .messages({
      'any.only': 'Lock period must be one of: 7 days, 30 days, 90 days, 180 days, 365 days'
    })
}).options({
  stripUnknown: true,
  abortEarly: false
});

module.exports = {
  swapSchema,
  liquiditySchema,
  removeLiquiditySchema,
  stakingSchema,
  ALLOWED_TOKENS
};
