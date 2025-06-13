# Meeting Content Management

## How to Update Meeting Information

The meeting content is now stored in a simple JSON file that's easy to edit and maintain.

### File Location
📁 `meeting-data.json` - Contains all meeting information

### Structure
```json
{
  "nextMeeting": {
    "date": "Freitag, den 20.06.2025, ab 18:30h",
    "description": "Die PowerShell Usergroup Hannover (PSUGH) trifft sich am:",
    "topics": [
      {
        "title": "Topic Title",
        "description": "Topic description with details"
      }
    ]
  }
}
```

### How to Update

1. **Edit the Date**: Change the `date` field to the new meeting date
2. **Update Topics**: Modify the `topics` array with new topics
3. **Add/Remove Topics**: Add or remove topic objects as needed
4. **Format Text**: Use `\n` for line breaks in descriptions

### Example Update

To change the meeting date and add a new topic:

```json
{
  "nextMeeting": {
    "date": "Freitag, den 17.07.2025, ab 18:30h",
    "topics": [
      {
        "title": "PowerShell 7.4 New Features",
        "description": "Exploring the latest features in PowerShell 7.4\nIncluding performance improvements and new cmdlets"
      },
      {
        "title": "Azure PowerShell Updates",
        "description": "What's new in Azure PowerShell modules"
      }
    ]
  }
}
```

### Benefits of This Approach

✅ **Simple**: Just edit one JSON file  
✅ **Maintainable**: No CSS or HTML knowledge required  
✅ **Flexible**: Easy to add/remove topics  
✅ **Readable**: Human-friendly format  
✅ **Automated**: Changes appear immediately on the website  

### Need Help?

If you need to make complex changes or encounter issues, just ask for help!
