"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAction } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  return (
    <form className="form-card" action={action}>
      <h1>Editorial desk</h1>
      <p>Sign in to edit MediHire content. Drafts stay off the public site until you publish them.</p>
      {state.error ? <p className="field-error" role="alert">{state.error}</p> : null}
      <input type="hidden" name="next" value={params.get("next") || "/admin"} />
      <div className="field">
        <label htmlFor="password">Editor password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="button primary" type="submit" disabled={pending}>{pending ? "Checking" : "Sign in"}</button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="wrap section">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
