import { authService } from './auth.service.js'
import { appConfig } from '../../config/app.config.js'

export const REFRESH_COOKIE_NAME = 'refreshToken'

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: appConfig.isProd,
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})

export class AuthController {
  constructor(service = authService) {
    this.service = service
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      const userAgent = req.headers['user-agent']

      const result = await this.service.login({
        email,
        password,
        ipAddress,
        userAgent,
      })

      // Send refresh token in secure HttpOnly cookie
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  refresh = async (req, res, next) => {
    try {
      const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      const userAgent = req.headers['user-agent']

      const result = await this.service.refresh({
        refreshToken: rawToken,
        ipAddress,
        userAgent,
      })

      // Rotate cookie with new refresh token
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions())

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  logout = async (req, res, next) => {
    try {
      const rawToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken
      const userId = req.user?.userId

      await this.service.logout({
        refreshToken: rawToken,
        userId,
      })

      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: appConfig.isProd,
        sameSite: 'strict',
        path: '/api/v1/auth',
      })

      res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
      })
    } catch (err) {
      next(err)
    }
  }

  me = async (req, res, next) => {
    try {
      const user = await this.service.getMe(req.user.userId)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (err) {
      next(err)
    }
  }
}

export const authController = new AuthController()

