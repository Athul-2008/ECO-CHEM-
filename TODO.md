# TODO — EcoChem Smart Sorting

## Responsive EcoChem header and page navigation — Complete
- Recreate the reference's sticky navigation header with the EcoChem flask mark, links for Assistant, Scan object, Our project, and Sorting guide, a bordered Start sorting action with an arrow, and the prototype label.
- Keep the navigation usable at desktop and narrow mobile widths, with working links to the corresponding page sections.

## Reference-matched hero and item search — Complete
- Recreate the hero headline “Give waste a better next chapter.” and the supporting chemistry-powered sorting description from the reference.
- Include a prominent item input with the placeholder “What are you throwing away?”, a “Sort it” action with an arrow, and working suggestion chips for banana peel, plastic bottle, old battery, smartphone, paper cup, and paint can.
- As a visitor types, show filtered, keyboard-accessible suggestions; selecting a suggestion or submitting a typed item must produce a useful result without requiring an account or external API.
- Recreate the slow, stylized globe visual and its “Sort smarter / Understand the chemistry” prompt, plus the Wendell Berry quote shown in the reference.

## Item sorting results, chemistry, and safety — Complete
- Display a sorting result for a selected item with its name, waste-stream placement, confidence indication, chemistry explanation, practical disposal tip, and item-specific safety guidance.
- Distinguish biodegradable, recyclable, hazardous, and electronic waste streams with the reference's green, blue, orange, and red color associations.
- Unknown typed items must still return a clear, cautious result instead of breaking or displaying an empty state; hold unidentified items separate rather than assigning a misleading stream or numeric score.

## Four waste streams — Complete
- Include the section “Four streams. One healthier planet.” with visually distinct, interactive cards for Biodegradable (“Returns to nature.”), Recyclable (“Gets a second life.”), Hazardous (“Handle with care.”), and Electronic (“Recover the tech.”).
- Cards must visibly highlight on hover/focus and remain readable and usable on mobile.

## Scan/upload and safety-first guidance — Complete
- Include “See it. Scan it. Sort it safely.” with a “Show me the object” prompt, an image upload/drop area, a camera-ready indicator, and an image preview after a file is selected.
- Provide a functional analysis flow using the selected image's filename or accessible local cues to show a cautious sorting suggestion, with no claim of server-side AI vision.
- Include a safety-first panel reminding visitors never to trust a mystery bin and presenting practical precautions such as using gloves and not puncturing unknown containers.

## Sorting guide and project/about content — Complete
- Include a working expandable sorting guide for the four streams, with quick sorting cues and a universal reminder to empty, clean, and dry recyclables.
- Include the project-notebook/about content explaining the objective “Make the right bin feel obvious,” the method “Search. Understand. Act.”, and why it matters, including “4 waste streams made clearer” and “1 planet to protect.”
- End with a responsive footer that fits the reference's visual hierarchy and provides working section navigation.

## GitHub-ready source and deployment — Complete
- Deliver complete, readable source code for the website in a repository-ready structure that can be copied to GitHub.
- Ensure the site builds and serves without private credentials, a paid API, or a database, and provide deployment instructions suitable for the completed repository.
