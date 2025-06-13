# Meeting Content Management

## How to Update Meeting Information

The meeting content is now stored in three separate JSON files that are easy to edit and maintain:

### File Locations

📁 `current-meeting.json` - Current/next meeting information  
📁 `past-events.json` - Historical events and materials  
📁 `upcoming-events.json` - Planned future events  

### Structure

**Current Meeting (`current-meeting.json`)**

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

**Past Events (`past-events.json`)**

```json
{
  "pastEvents": [
    {
      "date": "2024-09-20",
      "dateDisplay": "Freitag, den 20.09.2024",
      "title": "Event Title",
      "topics": [
        {
          "title": "Topic Title",
          "speaker": "Speaker Name",
          "description": "Topic description"
        }
      ],
      "materials": "https://github.com/PSUGH/PowerShell/tree/master/folder"
    }
  ]
}
```

**Upcoming Events (`upcoming-events.json`)**

```json
{
  "upcomingEvents": [
    {
      "date": "2025-07-18",
      "dateDisplay": "Freitag, den 18.07.2025",
      "title": "Event Title",
      "status": "planned"
    }
  ]
}
```

### How to Update

**For Current Meeting:**

1. **Edit the Date**: Change the `date` field in `current-meeting.json`
2. **Update Topics**: Modify the `topics` array with new topics
3. **Add/Remove Topics**: Add or remove topic objects as needed

**For Past Events:**

1. **Add New Event**: Add event object to `pastEvents` array in `past-events.json`
2. **Include Materials**: Add GitHub links to session materials
3. **Document Speakers**: Include speaker names and topic details

**For Upcoming Events:**

1. **Plan Ahead**: Add future events to `upcomingEvents` array in `upcoming-events.json`
2. **Set Status**: Use "planned" for tentative events
3. **Update Dates**: Use YYYY-MM-DD format for consistency

**General:**

- Use `\n` for line breaks in descriptions
- Keep file formatting consistent
- Validate JSON syntax before saving

### Example Updates

**Adding a New Current Meeting (`current-meeting.json`):**

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

**Adding a Past Event (`past-events.json`):**

```json
{
  "pastEvents": [
    {
      "date": "2025-06-20",
      "dateDisplay": "Freitag, den 20.06.2025",
      "title": "AI Agents with GitHub Copilot",
      "topics": [
        {
          "title": "Real Work with GitHub Copilot Agents in VS Code",
          "speaker": "Community Expert",
          "description": "Practical application of AI Agents beyond Hello World examples"
        }
      ],
      "materials": "https://github.com/PSUGH/PowerShell/tree/master/2025-06-20%20AI-Agents"
    }
  ]
}
```

### Benefits of This Approach

✅ **Organized**: Separate files for different purposes  
✅ **Simple**: Just edit the relevant JSON file  
✅ **Maintainable**: No CSS or HTML knowledge required  
✅ **Flexible**: Easy to add/remove events and topics  
✅ **Readable**: Human-friendly format  
✅ **Scalable**: Growing event history doesn't affect current meeting performance  
✅ **Automated**: Changes appear immediately on the website  

### Need Help?

If you need to make complex changes or encounter issues, just ask for help!
