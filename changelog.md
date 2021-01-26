## 2.1.4

Improvements:
- Block/report button is now in the message toolbar to prevent the slight resizing of message
- Started to write help documentation. Still in progrss.
- Some styling work. Still in progrss.
- Alphanumeric preset now ensure that there is at least 1 character.
- Polling to load ytcFilter in case browser is slow
- Popout's title now has the title of the video
- Reduce asynchronous code

Bug fixes:
- Properly manage messages without author
- Word break for message without spaces
- Prevent configuration leak between presets and current video
- Prevent breaking the popout when a video's settings are corrupted
- Thanks Kento Nishi for suggesting to remove 0 width characters from messages
- Fix the remaning storage space indicator


## 2.1.3

Changes:
- Build no longer compress files in order to hopefully, accelerate review process

Bug fixes:
- Remove block/report button cleanly so that Youtube's livechat can recycle them
- Optimize migration to 2.1.x. It should prevent high CPU/RAM usage during migration, if you haven't migrated already.
- Fix filtering by role in other language than English
- Avoid disconnecting chat when other extensions which require to patch Fetch like LiveTL are enabled

## 2.1.2

Bug fixes:
- Fix session stats for filtered message which would count 1 message several per filter it matched
- Fix filtering when a user may be both a moderator and member
- Fix missing color for super chat

## 2.1.1

Bug fixes:
- (Firefox only) Fixed a bug preventing messages to be persisted/displayed in popout when switching to the fetch interceptor

## 2.1.0 Kanata

Good bye old interface.

New features:
- Integrate Youtube's block/report menu in current session of embedded ytcFilter so as to fight against spam even for those without the extension. Note that due to the new fetch interceptor, the menu integration may take a minute to appear as fetch interceptor is faster than the livechat. Also, due to Youtube's limitation and performance, the menu can't be used if the message is no longer in the chat, so it's not permanent and may also be missing.
- Drag resize of embedded ytcFIlter
- Configurable automatic storage management
- Alert every minute if less than 5% of storage is available (Firefox is not supported)


Improvements:
- Removed legacy code for old interface which should result in better performance than 2.0.x
- Added a fetch interceptor to complement the Mutation observer. At first, Mutation observer will filter the first few message, but when the chat start to refresh from server, the task is delegated to the fetch interceptor. This has several effects: better performance without hitting the Youtube server, no more message/badge mixing, and for VOD, it will predict future messages.
- Profiles are renamed to preset to better convey how they should be used
- Reworked the interface. All presets related configuration are moved to their own tab
- Back to the 1 line compact interface for embedded ytcFilter
- Reduce storage usage per message.

Bug fixes:
- Fix regex for English tagged messages. Big thanks to NaGel.
- Fix slight size difference when opening popout with or without settings
- Fix possible case where ytcFilter may no longer load if you close a video before it had time loading
- Fix auto max height being too tall
- Potential fix for channel reordering when deleting a video archive

## 2.0.4

Bug fixes:
- Remove uneeded test files in release

## 2.0.3

Bug fixes:
- Due to how unpredictable storage usage has been for users, instead of migrating old messages, they are simply deleted.
- Prevent immediate reload when resizing popout
- Firefox only: Fix vuex-webextension library which failed to save the store in storage
- Single bootstraping at any time to avoid potential corruption of the store

## 2.0.2

I have reports of the extension needing history permission in 2.0.0 for Chrome. I don't know what happened but I have not requested history permission nor do I read it. Only tabs permission was added, and even this will be removed in this version.

Firefox version has rollbacked to 1.8.0 due to it being unable to keep its configuration after a restart of the browser. A fix will come at later date.

Bug fixes:
- Remove uneeded tabs permission

## 2.0.1

Bug fixes:
- New install on 2.0.0 were borked.
- Popout restore size
- Button sizing


## 2.0.0 Joe

New features

- New interface in popout window
- Default profiles for translation, languages, and staff
  - English tagged messages
  - Messages with Japanese characters
  - Messages with alphanumeric characters
  - Messages from staff
- Display archive and storage size usage
- Clear archive button in case storage is full
- Add a loading message in case ytcFilter doesn't load properly with a manual boot button

Improvements:

- UX
- Add several console.log message in order to help debugging
- Several part of ytcFilter have been rewritten

Known issues:

- Popout has not full feature parity with ytcFilter 1.8
- Screenshot is slow to process

## 1.8.0 Ina

If you are reading up to here; thanks for using ytcFilter.

The version 2.0.0 of ytcFilter will be a huge undertaking as numerous deep changes are planned to handle requested features, block spam, and better user experience. I hope I will be able to deliver it.

For now enjoy 1.8.0.

New features:

- Verified user filter with rendering

Improvements:

- Rewording and a little change for filter configuration

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
