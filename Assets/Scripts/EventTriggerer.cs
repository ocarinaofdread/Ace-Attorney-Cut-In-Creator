using UnityEngine;
using UnityEngine.Events;

public class EventTriggerer : MonoBehaviour
{
    [SerializeField] private UnityEvent triggerableEvent;

    public void TriggerEvent()
    {
        triggerableEvent.Invoke();
    }
}
