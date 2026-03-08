import { google } from "googleapis"
import { prisma } from "./db"
import { decrypt } from "./encryption"

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

/** Build the Google OAuth consent URL */
export function getGoogleAuthUrl(state: string): string {
  const client = getOAuthClient()
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    state,
  })
}

/** Exchange an authorization code for tokens */
export async function exchangeCode(code: string) {
  const client = getOAuthClient()
  const { tokens } = await client.getToken(code)
  return tokens
}

/** Get an authenticated OAuth client for a stored connection */
async function getAuthenticatedClient(connectionId: string) {
  const conn = await prisma.googleConnection.findUnique({
    where: { id: connectionId },
  })
  if (!conn || conn.revokedAt) throw new Error("Google connection not found or revoked")

  const client = getOAuthClient()
  client.setCredentials({ refresh_token: decrypt(conn.refreshToken) })
  return client
}

/** Get list of tabs in a spreadsheet */
export async function getSpreadsheetTabs(
  connectionId: string,
  spreadsheetId: string
): Promise<{ title: string; sheetId: number }[]> {
  const auth = await getAuthenticatedClient(connectionId)
  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.get({ spreadsheetId, fields: "properties.title,sheets.properties" })
  return (
    res.data.sheets?.map((s) => ({
      title: s.properties?.title ?? "Sheet1",
      sheetId: s.properties?.sheetId ?? 0,
    })) ?? []
  )
}

/** Get spreadsheet title */
export async function getSpreadsheetTitle(
  connectionId: string,
  spreadsheetId: string
): Promise<string> {
  const auth = await getAuthenticatedClient(connectionId)
  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.get({ spreadsheetId, fields: "properties.title" })
  return res.data.properties?.title ?? "Untitled"
}

/** Get column headers (first row) */
export async function getSheetHeaders(
  connectionId: string,
  spreadsheetId: string,
  sheetName: string
): Promise<string[]> {
  const auth = await getAuthenticatedClient(connectionId)
  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!1:1`,
  })
  return (res.data.values?.[0] as string[]) ?? []
}

/** Get preview rows (first 5 data rows, excluding header) */
export async function getSheetPreview(
  connectionId: string,
  spreadsheetId: string,
  sheetName: string
): Promise<{ headers: string[]; rows: string[][] }> {
  const auth = await getAuthenticatedClient(connectionId)
  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'!1:6`,
  })
  const values = res.data.values ?? []
  const headers = (values[0] as string[]) ?? []
  const rows = values.slice(1) as string[][]
  return { headers, rows }
}

/** Get all data rows (excluding header) */
export async function getSheetRows(
  connectionId: string,
  spreadsheetId: string,
  sheetName: string
): Promise<{ headers: string[]; rows: string[][] }> {
  const auth = await getAuthenticatedClient(connectionId)
  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${sheetName}'`,
  })
  const values = res.data.values ?? []
  const headers = (values[0] as string[]) ?? []
  const rows = values.slice(1) as string[][]
  return { headers, rows }
}

/** Parse a Google Sheets URL into spreadsheet ID */
export function parseSpreadsheetUrl(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  return match?.[1] ?? null
}
