# ytcFilter 1.7.0

Please check the <a href="https://github.com/RomainLK/ytc-filter/wiki" target="_blank">wiki</a> for guide and help.

Welcome to ytcFilter. This message will only appear the first time you install this extension, or update it. It can be displayed again by clicking on "ytcFilter" > "Show options" > "Changelog".

For bug reports or feature request, contact the developer directly or on <a href="https://github.com/RomainLK/ytc-filter"  target="_blank">Github</a>.

# Changelog

## 1.8.0 Ina

If you are reading up to here; thanks for using ytcFilter. The version 2.0.0 of ytcFilter will be a huge undertaking as numerous deep changes are planned to handle requested features, block spam, and better user experience. I hope I will be able to deliver it. For now enjoy 1.8.0.

New features:

- Verified user filter with rendering

Improvements:

- Rewording and a little change for filter configuration for easi

## 1.7.0 Himawari

New features:

- Membership filter with rendering
- Super chat filter with rendering
- Session stats
- Message to remind that autoscrolling is needed in order for ytcFilter to work

Bugfixes:

- Removed extraneous tags like tooltips which could be displayed due to sanitazing

## 1.6.1

Bugfixes:

- Official support for popout chat. It was never tested with that before.
- Due to a browser limitation, limit storage length to 14 days for captured messages and filter list for a video. This is a temporary measure until some longer storage solution is defined or storage management.
- Add an automatic process to migrate old "default profile" to the new profile system.

## 1.6.0 Gibara

New features:

- Import/export filters with copy/paste
- Multiple profile support
  - Default profile per channel. Youtube only.
- Auto max height option
- Button to screenshot captured messages

Improvements:

- Support for Youtube studio interface. As a channel, it's referenced as "studio"
- CSS for links
- Max height is limited by the available space of the chat
- Added tooltips to explains the various buttons
- Added some code name for each minor version

Known issue:

- Default per channel does not work on embedded chat because we lack a channel ID for now.

## 1.5.0 Fubuki

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

## 1.4.0 Elu

Improvements:

- Emoji are now displayed in the captured messages.

Known issues:

- If ytcFilter's window is too big, the "Top chat" dropdown of Youtube may not render properly. No fixes were found for now.

## 1.3.1 Debiru

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

## 1.2.0 Coco

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

## 1.1.0 Botan

New features:

- Firefox support
- Text filter support
- Regex filter support
- Case sensitive filtering option
- Auto scroll option

Known issues:

- Duplication will happen if the extension is used both on the live stream and VOD

## 1.0.0 Aqua

Initial release

Features:

- Filter by nickname
- Persistance between reload
