using System;
using System.Text.Json.Serialization;

namespace Reminder.Models
{
    public class Task
    {
        public Guid TaskId { get; set; }

        public string Content { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime LastEdited { get; set; }

        [JsonIgnore] public virtual Collection Collection { get; set; }
    }
}