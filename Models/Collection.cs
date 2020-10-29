using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reminder.Models
{
    public class Collection
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CollectionId { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime LastEdited { get; set; }
        
        [JsonIgnore]
        public virtual User Owner { get; set; }

        [JsonIgnore] public virtual List<Task> Tasks { get; set; }
    }
}