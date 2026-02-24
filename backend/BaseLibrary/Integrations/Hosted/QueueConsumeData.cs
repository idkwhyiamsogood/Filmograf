using System.ComponentModel;

namespace Filmograf.BaseLibrary.Integrations.Hosted;

public class QueueConsumeData
{
    public string QueueName { get; set; }

    [DefaultValue(true)]
    public bool AutoAck { get; set; } = true;
}