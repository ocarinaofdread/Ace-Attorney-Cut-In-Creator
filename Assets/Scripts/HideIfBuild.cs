using UnityEngine;
using System.Collections;

public class HideIfBuild : MonoBehaviour
{
    [SerializeField] private bool destroy;

    void Start()
    {
        if (!Application.isEditor)
        {
            if (destroy) Destroy(gameObject);

            gameObject.SetActive(false);
        }
    }

    void Update()
    {
        
    }
}
