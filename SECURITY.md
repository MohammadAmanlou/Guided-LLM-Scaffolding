# Security Policy

## Project status

AIED Guided-LLM Learning Platform is research software. The repository is
designed to support local, controlled demonstrations and research replication;
it has not been independently security-audited and should not be treated as a
production-ready learning management system.

Only the latest version on the default branch is maintained. Historical
snapshots and unmaintained deployments may not receive security fixes.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability, exposed secret,
or learner-data incident.

Use the repository's **Security** tab and select **Report a vulnerability** to
send a private report through GitHub Private Vulnerability Reporting. Include:

- the affected component and revision;
- a concise description of the impact;
- reproducible steps or a minimal proof of concept;
- any relevant logs with credentials and personal data removed; and
- suggested mitigations, if available.

If private vulnerability reporting is not enabled, contact a maintainer through
an established private institutional channel and ask for a secure reporting
route. Do not transmit API keys, passwords, tokens, participant records, or raw
chat histories in the initial message.

Maintainers should acknowledge a complete report as soon as practical, assess
severity and scope, coordinate a fix, and credit the reporter when requested and
appropriate. No fixed response-time guarantee is offered for this academic
prototype.

## Secrets and local configuration

- Copy `platform/backend/.env.example` to `platform/backend/.env` for local use.
- Generate unique, independent values for `SECRET_KEY` and `JWT_SECRET_KEY`.
- Store the LLM provider credential only in `LLM_API_KEY` or an external secret
  manager.
- Never commit `.env`, private keys, database dumps, chat exports, learner
  uploads, or assessment exports.
- Rotate a credential immediately if it appears in a commit, log, screenshot,
  archive, or shared message. Removing it from the latest file is not sufficient
  because Git history may retain it.

The example environment file intentionally contains no credentials.

## Learner data and research records

This application can process authentication data, chat content, assessment
answers, uploaded documents, scores, and usage records. These data may be
sensitive even after direct identifiers are removed.

Before collecting real learner data, establish an approved data-management plan
covering consent, lawful basis, ethics review, access control, retention,
deletion, backups, de-identification, incident response, and the policies of the
institution and LLM provider. Use synthetic accounts and disposable records for
public demonstrations.

## Deployment hardening

Before exposing the platform beyond a trusted local or institutional network:

1. Review authorization on every course, practice, quiz, upload, export, and
   chat endpoint. Several research-era workflows rely on client-supplied record
   identifiers and require additional object-level authorization for production
   use.
2. Terminate HTTPS with a maintained reverse proxy and enable secure transport
   between deployment components where appropriate.
3. Restrict allowed origins and hosts; do not use permissive CORS settings in a
   public deployment.
4. Add rate limits and abuse controls to authentication, upload, assessment, and
   LLM endpoints.
5. Validate file type, size, storage location, and malware risk for every
   uploaded file.
6. Keep MongoDB and ChromaDB off the public Internet and protect backups with
   access controls and encryption.
7. Run containers with the least privilege available and keep base images and
   dependencies patched.
8. Centralize security logging without recording passwords, tokens, API keys,
   complete prompts, or unnecessary learner content.
9. Define backup restoration, credential rotation, token revocation, and data
   deletion procedures before enrollment.
10. Perform dependency, static-analysis, and application-security testing for
    the target environment.

## LLM-specific considerations

- Treat prompts, retrieved records, and model responses as untrusted content.
- Do not place participant identifiers or confidential course material in an
  external provider request unless the approved research protocol and provider
  agreement explicitly permit it.
- Apply provider-side retention and regional-processing controls where
  available.
- Expect inaccurate or unsafe model output and keep appropriate human oversight
  for educational decisions.
- Do not use model output alone for grading, disciplinary action, or other
  high-impact decisions.
- Budget and rate-limit provider usage to reduce denial-of-wallet risk.

## Scope of public disclosure

The public repository intentionally excludes original participant accounts,
group assignments, attendance records, chat transcripts, uploaded answer sheets,
database dumps, and assessment exports. If any such material is discovered,
treat it as a privacy incident and report it privately.
