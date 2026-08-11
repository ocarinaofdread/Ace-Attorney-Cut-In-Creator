using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ProgressBar : MonoBehaviour
{
    public static float percentage; // float from zero to one
    private float previousPercentage;
    [SerializeField] private float percentageTracker;

    public static string message;
    private string previousMessage;
    [SerializeField] private string messageTracker;
    [SerializeField] private TextMeshProUGUI messageObject;

    private RectTransform thisTransform;

    private void Awake()
    {
        thisTransform = GetComponent<RectTransform>();

        thisTransform.localScale = new Vector3(0f, 1f, 1f);
    }

    private void Update()
    {
        percentageTracker = percentage;
        messageTracker = message;

        if (previousPercentage != percentage)
        {
            previousPercentage = percentage;

            thisTransform.localScale = new Vector3(percentage, 1f, 1f);
        }
        if (previousMessage != message)
        {
            previousMessage = message;

            messageObject.text = previousMessage;
        }
    }

}
