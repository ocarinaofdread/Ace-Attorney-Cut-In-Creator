using UnityEngine;

public class AudioClipPlayer : MonoBehaviour
{
    [SerializeField] private AudioClip clip;
    [SerializeField] private bool playAudio;
    private AudioSource source;

    private void Awake()
    {
        source = GetComponent<AudioSource>();
    }

    public void PlayOneShot()
    {
        if (playAudio) source.PlayOneShot(clip);
    }
}
