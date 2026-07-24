/**
 * Authentication handlers — extracted from KiloProvider.
 *
 * Manages login (device auth flow), logout, organization switching,
 * and profile refresh. No vscode dependency.
 */

import type { KiloClient } from "@kilocode/sdk/v2/client"
import { getErrorMessage } from "../../kilo-provider-utils"

export interface AuthContext {
  readonly client: KiloClient | null
  postMessage(msg: unknown): void
  getWorkspaceDirectory(): string
  disposeGlobal(): Promise<void>
  fetchAndSendProviders(): Promise<void>
  fetchAndSendAgents(): Promise<void>
}

/**
 * Handle login via the provider OAuth device-auth flow.
 * Sends device auth messages so the webview can display QR code, code, and timer.
 *
 * @param attempt - The current login attempt counter value (pre-incremented by caller).
 * @param getAttempt - Returns the latest attempt counter (may have changed if user cancelled).
 */
export async function handleLogin(ctx: AuthContext, attempt: number, getAttempt: () => number): Promise<void> {
  // Login via Kilo Gateway is disabled in this fork.
  console.log("[Kilo New] KiloProvider: 🔐 Login request ignored (Kilo Gateway login disabled)")
}

/** Handle logout: remove auth credentials and clear profile. */
export async function handleLogout(ctx: AuthContext): Promise<void> {
  if (!ctx.client) return

  try {
    console.log("[Kilo New] KiloProvider: 🚪 Logging out...")
    await ctx.client.auth.remove({ providerID: "kilo" }, { throwOnError: true })
    console.log("[Kilo New] KiloProvider: 🚪 Logged out successfully")
    ctx.postMessage({ type: "profileData", data: null })

    await ctx.disposeGlobal()

    await ctx.fetchAndSendProviders()
  } catch (error) {
    console.error("[Kilo New] KiloProvider: ❌ Logout failed:", error)
    ctx.postMessage({
      type: "error",
      message: getErrorMessage(error) || "Failed to logout",
    })
  }
}

/**
 * Handle organization switch.
 * Persists the selection and refreshes profile + providers since both change with org context.
 */
export async function handleSetOrganization(ctx: AuthContext, organizationId: string | null): Promise<void> {
  if (!ctx.client) return

  console.log("[Kilo New] KiloProvider: Switching organization:", organizationId ?? "personal")
  try {
    await ctx.client.kilo.organization.set({ organizationId }, { throwOnError: true })
  } catch (error) {
    console.error("[Kilo New] KiloProvider: Failed to switch organization:", error)
    // Re-fetch current profile to reset webview state — best-effort
    try {
      const result = await ctx.client.kilo.profile()
      ctx.postMessage({ type: "profileData", data: result.data ?? null })
    } catch (profileError) {
      console.error("[Kilo New] KiloProvider: Failed to refresh profile after org switch error:", profileError)
    }
    return
  }

  await ctx.disposeGlobal()

  // Org switch succeeded — refresh profile and providers independently (best-effort)
  try {
    const result = await ctx.client.kilo.profile()
    ctx.postMessage({ type: "profileData", data: result.data ?? null })
  } catch (error) {
    console.error("[Kilo New] KiloProvider: Failed to refresh profile after org switch:", error)
  }
  try {
    await ctx.fetchAndSendProviders()
  } catch (error) {
    console.error("[Kilo New] KiloProvider: Failed to refresh providers after org switch:", error)
  }
  try {
    await ctx.fetchAndSendAgents()
  } catch (error) {
    console.error("[Kilo New] KiloProvider: Failed to refresh agents after org switch:", error)
  }
}

/** Handle profile refresh request. */
export async function handleRefreshProfile(ctx: AuthContext): Promise<void> {
  if (!ctx.client) return

  console.log("[Kilo New] KiloProvider: 🔄 Refreshing profile...")
  const result = await ctx.client.kilo.profile().catch(() => ({ data: null }))
  ctx.postMessage({ type: "profileData", data: result.data ?? null })
}
