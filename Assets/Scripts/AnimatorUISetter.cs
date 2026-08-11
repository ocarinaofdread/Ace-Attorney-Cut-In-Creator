using UnityEngine;

public class AnimatorUISetter : MonoBehaviour
{
    [SerializeField] private string boolName;
    private int boolNameHash;
    [SerializeField] private string triggerName;
    private int triggerNameHash;

    private Animator animator;

    private void Awake()
    {
        animator = GetComponent<Animator>();
        boolNameHash = Animator.StringToHash(boolName);
        triggerNameHash = Animator.StringToHash(triggerName);
    }

    public void SetBool(bool state)
    {
        animator.SetBool(boolNameHash, state);
    }

    public void SetTrigger()
    {
        animator.SetTrigger(triggerNameHash);
    }
}
