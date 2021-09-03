# amigest

### What it does:

- Downloads daily photos from Amigest
- Update metadata tags with entry date and description
 
### Instructions:

- Login to Amigest and extract your auth bearer and personID to auth.js
- Specify how far back to download photos with minimumDate variable
- Create photos folders for where photos will be downloaded

### What's to do:

- Figure out a cleaner way than sleep() to prevent from sending too much simultaneous requests to Amigest
- Replace auth bearer and personID with actual credentials to facilitate setup and prevent auth expiring 
- Prevent the creation of "originals" duplicates when updating metadata tags
- Pass in dates through command line rather than through code
- General code clean up because I lost all my developer badges