const initialContent = `# Welcome to the MDX Editor!

Edit the markdown on the left to see it rendered with the Blue Button site's components. Your changes are saved in this browser.

Markdown links use the site's link styles: [an internal page](/api-documentation), [an external site](https://www.medicare.gov), and [a download](/assets/files/example.pdf).

<Link href="https://sandbox.bluebutton.cms.gov" variant="primary">Button-style link</Link>

## Alert

<Alert heading="Info alert" headingAs="h3">This alert uses the default info variant.</Alert>

<Alert heading="Warning alert" headingAs="h3" variant="warning" noIcon>This alert uses the warning variant without an icon.</Alert>

<Alert size="slim">A slim alert has no heading. Variants include \`info\`, \`warning\`, \`success\`, \`error\` and \`emergency\`.</Alert>

## Process list

<ProcessList>
<ProcessListItem>
### Register for the sandbox

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi commodo, ipsum sed pharetra gravida.
</ProcessListItem>
<ProcessListItem>
### Build your app

- Nullam sit amet enim.
- Suspendisse id velit vitae ligula volutpat condimentum.
</ProcessListItem>
</ProcessList>

## Accordion

<AccordionList>
<AccordionItem heading="Privacy Policy" headingAs="h4" isExpanded>
Your privacy policy should describe how user data will be collected, used, and shared.
</AccordionItem>
<AccordionItem heading="Terms of Service" headingAs="h4">
Your terms of service should explain the rules for using your app.
</AccordionItem>
</AccordionList>

## Icon list

<IconList>
### Personal health data aggregators

Digital health applications can use Blue Button to give Medicare enrollees a more comprehensive view of their health data.[^1]
</IconList>

## Table

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| MDX | ✅ |
| Tables | ✅ |

[^1]: Footnotes are supported too.
`

export default initialContent
