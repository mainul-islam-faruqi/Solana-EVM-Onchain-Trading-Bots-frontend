import { COLORS, colorWithOpacity, statusColors, gradients } from '../constants/colors'

export const getColor = (color: keyof typeof COLORS) => `#${COLORS[color]}`
export const getAlpha = (color: keyof typeof colorWithOpacity) => colorWithOpacity[color]
export const getStatus = (status: keyof typeof statusColors) => statusColors[status]
export const getGradient = (gradient: keyof typeof gradients) => gradients[gradient] 