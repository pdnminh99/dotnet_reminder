using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;

public class AppUser : IdentityUser
{ }

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

    public bool IsCompleted => CompletedAt != null;

    [JsonIgnore] public virtual Collection Collection { get; set; }
}

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

    [JsonIgnore] public virtual List<AppTask> Tasks { get; set; }

    [NotMapped] public List<AppTask> CompletedTasks => Tasks?.Where(t => t.IsCompleted).ToList();

    [NotMapped] public List<AppTask> IncompletedTasks => Tasks?.Where(t => !t.IsCompleted).ToList();
}