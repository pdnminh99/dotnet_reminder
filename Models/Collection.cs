using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reminder.Models
{
    public class Collection
    {
#nullable enable
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? CollectionId { get; set; }

        public DateTime? CreationDate { get; set; }

        public DateTime? LastEdited { get; set; }

        [JsonIgnore] public virtual AppUser? Owner { get; set; }
#nullable disable

        [Required(AllowEmptyStrings = false, ErrorMessage = "`Name` field must not empty or null.")]
        public string Name { get; set; }

        [JsonIgnore] public virtual List<Task> Tasks { get; set; }
    }
}