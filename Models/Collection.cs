using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Reminder.Models
{
    public class Collection
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CollectionId { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "`Name` field must not empty or null.")]
        public string Name { get; set; }

        [BindNever] public DateTime CreationDate { get; set; }

        [BindNever] public DateTime LastEdited { get; set; }

#nullable enable
        [JsonIgnore] public virtual User? Owner { get; set; }
#nullable disable

        [JsonIgnore] public virtual List<Task> Tasks { get; set; }
    }
}