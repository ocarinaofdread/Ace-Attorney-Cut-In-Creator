using System;
using UnityEngine;

public class ImageReceiver : MonoBehaviour
{
    private CutInManager cutInManager;
    private Texture2D leftTex;
    private Texture2D rightTex;

    private void OnEnable()
    {
        cutInManager = GetComponent<CutInManager>();
    }

    public void SendImageToRightCutIn(string base64Image)
    {
        SendImageToCutIn(false, base64Image, rightTex);
    }

    public void SendImageToLeftCutIn(string base64Image)
    {
        SendImageToCutIn(true, base64Image, leftTex);
    }

    private void SendImageToCutIn(bool left, string base64Image, Texture2D tex)
    {
        if (tex) Destroy(tex);

        byte[] imageBytes = Convert.FromBase64String(base64Image);

        tex = new Texture2D(1, 1);

        tex.LoadImage(imageBytes);

        if (left)
        {
            cutInManager.ChangeLeftCutIn(tex);
        }
        else
        {
            cutInManager.ChangeRightCutIn(tex);
        }
    }
}