using System.ComponentModel;

namespace Filmograf.BaseLibrary.Integrations.Hosted;

public class QueueDeclareData
{
    public string QueueName { get; set; }

    [DefaultValue(true)]
    public bool Durable { get; set; } = true;
    
    [DefaultValue(false)]
    public bool Exclusive { get; set; } = false;
    
    [DefaultValue(false)]
    public bool AutoDelete { get; set; } = false;

    public static QueueDeclareData[] MapQueues(string[] queueNames)
    {
        return queueNames
            .Select(name => new QueueDeclareData { QueueName = name })
            .ToArray();
    }
}