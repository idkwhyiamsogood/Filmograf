using System.ComponentModel;

namespace Filmograf.BaseLibrary.Integrations.Hosted;

public class QueueConsumeData
{
    public string QueueName { get; set; }

    [DefaultValue(false)]
    public bool AutoAck { get; set; } = false;
    
    public static QueueConsumeData[] MapConsumes(string[] queueNames)
    {
        return queueNames
            .Select(name => new QueueConsumeData { QueueName = name })
            .ToArray();
    }
}