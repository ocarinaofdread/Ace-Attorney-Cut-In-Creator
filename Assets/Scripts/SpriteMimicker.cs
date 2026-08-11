using UnityEngine;

public class SpriteMimicker : MonoBehaviour
{
    [SerializeField] private SpriteRenderer rendererToMimick;
    private SpriteRenderer thisRenderer;
    private Sprite currentSprite;

    private void Awake()
    {
        thisRenderer = GetComponent<SpriteRenderer>();
    }

    private void Update()
    {
        if (rendererToMimick.sprite != currentSprite)
        {
            currentSprite = rendererToMimick.sprite;
            thisRenderer.sprite = currentSprite;
        }
    }
}
