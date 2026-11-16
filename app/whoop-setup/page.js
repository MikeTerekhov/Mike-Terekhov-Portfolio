export const metadata = { title: "WHOOP setup" };
export default function WhoopSetup() {
  return <main className="site-shell editorial">
    <h1>Connect WHOOP</h1>
    <p className="intro">Private setup for the portfolio owner. This authorizes read-only access to recovery, sleep, and strain.</p>
    <form action="/api/whoop/connect" method="post" className="whoop-setup-form">
      <label htmlFor="setup_key">Setup key</label>
      <input id="setup_key" type="password" name="setup_key" required autoComplete="off" />
      <button className="text-button" type="submit">Authorize WHOOP</button>
    </form>
  </main>;
}
