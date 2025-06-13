# Data Structure Documentation

## Overview

The PSUGH website now uses a modular data structure with three separate JSON files instead of one monolithic file. This provides better organization, maintainability, and performance.

## File Structure

### 📁 `current-meeting.json`
**Purpose**: Contains information about the current/next meeting  
**Usage**: Loaded by the homepage to display upcoming meeting details  
**Update Frequency**: Before each meeting (monthly)

```json
{
  "nextMeeting": {
    "date": "Freitag, den 20.06.2025, ab 18:30h",
    "description": "Die PowerShell Usergroup Hannover (PSUGH) trifft sich am:",
    "topics": [
      {
        "title": "Topic Title",
        "description": "Topic description with line breaks\nSecond line"
      }
    ]
  }
}
```

### 📁 `past-events.json`
**Purpose**: Archive of all historical events with materials and speakers  
**Usage**: Loaded by the events page to display past meetings  
**Update Frequency**: After each meeting

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
          "description": "Detailed description"
        }
      ],
      "materials": "https://github.com/PSUGH/PowerShell/tree/master/folder"
    }
  ]
}
```

### 📁 `upcoming-events.json`
**Purpose**: Planned future events beyond the next meeting  
**Usage**: Loaded by the events page to show planned meetings  
**Update Frequency**: As events are planned (quarterly)

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

## Benefits

✅ **Performance**: Smaller file sizes for faster loading  
✅ **Organization**: Clear separation of concerns  
✅ **Maintainability**: Easy to update specific types of content  
✅ **Scalability**: Past events don't slow down current meeting loading  
✅ **Development**: Easier testing and validation of specific data types  
✅ **Caching**: Different cache strategies for different data types  

## File Loading

### Homepage (`index.html`)
- Loads only `current-meeting.json`
- Displays next meeting information
- Fast loading for main page

### Events Page (`events.html`)
- Loads all three files in parallel using `Promise.all()`
- Combines data for calendar and event displays
- Efficient parallel loading

## Migration Notes

- **Old file**: `meeting-data.json` (removed)
- **New files**: `current-meeting.json`, `past-events.json`, `upcoming-events.json`
- **JavaScript updated**: Both `index.html` and `events.html` now use new file structure
- **Documentation updated**: README.md and MEETING-CONTENT.md reflect new structure

## Workflow

1. **Before a meeting**: Update `current-meeting.json` with new date/topics
2. **After a meeting**: 
   - Move completed meeting from `current-meeting.json` to `past-events.json`
   - Add materials/recordings links
   - Update `current-meeting.json` with next meeting
3. **Planning ahead**: Add future meetings to `upcoming-events.json`

## Error Handling

Each file is loaded independently with proper error handling. If one file fails to load, the others continue to work, ensuring the website remains functional.

## Validation

All JSON files should be validated before deployment:
- Syntax validation
- Schema validation (if implemented)
- Cross-reference validation (dates, links)
