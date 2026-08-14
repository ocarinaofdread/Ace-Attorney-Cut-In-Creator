using NUnit.Framework;
using UnityEngine;
using System.Collections.Generic;

public class StyleManager : MonoBehaviour
{
    [SerializeField] private List<GameObject> styles = new();

    public void SwitchStyle(string name)
    {
        HideAllStyles();
        foreach(GameObject style in styles)
        {
            if (style.name == name)
            {
                style.SetActive(true);
            }
        }
    }

    private void HideAllStyles()
    {
        foreach(GameObject style in styles)
        {
            style.SetActive(false);
        }
    }
}
