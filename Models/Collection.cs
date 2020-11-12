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
        [JsonIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? CollectionId { get; set; }

        // This prevent clients explicitly set `id` field
        [JsonPropertyName("collectionId")] public int? PublicCollectionId => CollectionId;

        [JsonIgnore] public DateTime? CreationDate { get; set; }

        [JsonPropertyName("creationDate")] public long? CreationDateInUnix => Utils.DateTimeToUnixTime(CreationDate);

        [JsonIgnore] public DateTime? LastEdited { get; set; }

        [JsonPropertyName("lastEdited")] public long? LastEditedAtInUnix => Utils.DateTimeToUnixTime(LastEdited);

        [JsonIgnore] public virtual AppUser? Owner { get; set; }
#nullable disable

        [Required(AllowEmptyStrings = false, ErrorMessage = "Collection `Name` field must not empty or null.")]
        public string Name { get; set; }

        public virtual IEnumerable<AppTask> Tasks { get; set; }
    }
}