# ytcFilter

Welcome to ytcFilter. This message will only appear the first time you install this extension, or update it. It can be displayed again by clicking on "ytcFilter" > "Show options" > "Changelog".

For help, please check the <a href="https://github.com/RomainLK/ytc-filter/wiki" target="_blank">wiki</a>

For bug reports or feature request, contact the developer directly or on <a href="https://github.com/RomainLK/ytc-filter"  target="_blank">Github</a>.

# Changelog

## 1.6.0

Improvements:

- Support for Youtube studio

## 1.5.0

New features:

- Message management bar: By clicking on on the timestamp, a new toolbar will be displayed
  - Scroll to button: Scroll Youtube chat to display the message which was captured. Note that Youtube chat isn't infinite so the message may no longer be present.
  - Delete message: Remove message from captured messages
- A link has been added to the Github wiki for help.

Improvements:

- Timestamps within Youtube chat are no longer needed for duplicate message management.
- Better styling when hovering a button.

Bugfixes:

- Limit size of emoji in captured messages
- Display the changelog properly on new version

## 1.4.0

Improvement:

- Emoji are now displayed in the captured messages.

Known issue:

- If ytcFilter's window is too big, the "Top chat" dropdown of Youtube may not render properly. No fixes were found for now.

## 1.3.1

Changes:

- Auto scroll is triggered only if the captured chat is at the bottom
- Redesign notification

New features:

- Filter by moderator
- Filter by owner
- Resizing option with a height slider
- Support for embedded chat outside of Youtube (i.e. Jetri)
- Changelog notification
- Remove default profile button
- Apply default profile button
- Auto open ytcFilter option. This settings is on a per video basis. Use the default profile to apply it to new videos.

## 1.2.0

Due to an unfortunate coincidence, the extension is now named ytcFilter.

New features:

- Scroll to top/bottom buttons
- Option to set a default profile which is automatically applied to new livechat

## 1.1.2

Code cleaning for Firefox approval process

## 1.1.1

Bugfix:

- Case sensitive didn't work
- Filter removal didn't save to storage

## 1.1.0

New features:

- Firefox support
- Text filter support
- Regex filter support
- Case sensitive filtering option
- Auto scroll option

Known issues:

- Duplication will happen if the extension is used both on the live stream and VOD

## 1.0.0

Initial release

Features:

- Filter by nickname
- Persistance between reload
