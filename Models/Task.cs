using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reminder.Models
{
    public class Task
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TaskId { get; set; }

        public string Content { get; set; }

        public DateTime? DueDate { get; set; }

        [DefaultValue("")] public string Note { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime LastEdited { get; set; }

        [JsonIgnore] public virtual Collection Collection { get; set; }
    }
}