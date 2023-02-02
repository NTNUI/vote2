import { Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { isValidNtnuiToken, refreshNtnuiToken } from 'ntnui-tools'
import { CustomError, UnauthorizedUserError } from 'ntnui-tools/customError'
import { RequestWithNtnuiNo } from './request'

/**
 * # The authorization middleware - Provided by NTNUI
 * 1. Retrieve access- and refresh-token from cookies
 *     * If none are sent return error
 * 2. Check validity of access token against NTNUI
 *     - If not valid, check if refresh token is sent
 *         * If refresh token is sent, try refreshing against NTNUI
 *         * Retrieve new access token
 *         * Return new accessToken
 *     - Decode ntnui_no from token and add to request
 *     - Allow user through middleware with next()
 */
const authorization = async (
	req: RequestWithNtnuiNo,
	res: Response,
	next: NextFunction
) => {
	let { accessToken } = req.cookies
	const { refreshToken } = req.cookies
	try {
		if (!refreshToken && !accessToken) {
			throw new CustomError('No tokens sent', 401)
		}
		const isValid = await isValidNtnuiToken(accessToken)
		if (!isValid) {
			// Try to refresh
			if (!refreshToken) {
				throw new CustomError('No refresh-token sent', 401)
			}
			const newToken = await refreshNtnuiToken(refreshToken)
			if (newToken) {
				accessToken = newToken.access
				// Set cookies
				res.cookie('accessToken', newToken.access, {
					maxAge: 1800000, // 30 minutes
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: true,
				})
			} else {
				throw new CustomError('Invalid token', 401)
			}
		}
		const decoded = jsonwebtoken.decode(accessToken)
		if (decoded && typeof decoded !== 'string') {
			req.ntnuiNo = decoded.ntnui_no
			return next()
		}
		throw UnauthorizedUserError
	} catch (error) {
		return next(error)
	}
}

export default authorization