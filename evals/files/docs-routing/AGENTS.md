# Repository guidance

- Run `python -m linkcheck docs` after editing documentation.
- Do not edit files under `site/generated/` by hand.
- The service uses a three-stage rendering pipeline with an internal cache between parsing and layout.
- Production deployment uses two regions and a manual traffic-shift checklist maintained by operators.
- The completed renderer rollout used a temporary feature flag that is no longer active.
