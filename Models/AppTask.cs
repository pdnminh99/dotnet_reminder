using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reminder.Models
{
    [Table("Tasks")]
    public class AppTask
    {
        [Key]
        [JsonIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? TaskId { get; set; }

        // This prevent clients explicitly set `id` field
        [JsonPropertyName("taskId")] public int? PublicTaskId => TaskId;

        [Required(AllowEmptyStrings = false, ErrorMessage = "Task `Content` field must not empty or null.")]
        public string Content { get; set; }

        [JsonIgnore] [DefaultValue(null)] public DateTime? DueDate { get; set; }

        [NotMapped]
        [JsonPropertyName("dueDate")]
        public long? DueDateInUnix
        {
            get => Utils.DateTimeToUnixTime(DueDate);
            set => DueDate = Utils.UnixTimeToDateTime(value);
        }

        [JsonIgnore] [DefaultValue(null)] public DateTime? CompletedAt { get; set; }

        [NotMapped]
        [JsonPropertyName("completedAt")]
        public long? CompletedAtInUnix
        {
            get => Utils.DateTimeToUnixTime(CompletedAt);
            set => CompletedAt = Utils.UnixTimeToDateTime(value);
        }

        [DefaultValue(false)] public bool IsFlagged { get; set; }

        [DefaultValue("")] public string Note { get; set; }

        [JsonIgnore] public DateTime? CreationDate { get; set; }

        [JsonPropertyName("creationDate")] public long? CreationDateInUnix => Utils.DateTimeToUnixTime(CreationDate);

        [JsonIgnore] public DateTime? LastEdited { get; set; }

        [JsonPropertyName("lastEdited")] public long? LastEditedAtInUnix => Utils.DateTimeToUnixTime(LastEdited);

        [JsonIgnore] public virtual Collection Collection { get; set; }
    }
}