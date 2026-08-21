using NUnit;
using System;
using System.Collections;
using System.IO;
using System.Runtime.InteropServices;
using Unity.Collections;
using UnityEngine;

public class FrameRenderer : MonoBehaviour
{
    [DllImport("__Internal")] private static extern void SendFrameToJS(IntPtr arrayPointer, int arrayLength);
    [DllImport("__Internal")] private static extern void BeginRendering(string jsonString);
    [DllImport("__Internal")] private static extern void BeginEncoding();


    [SerializeField] private Camera exportCamera;
    [SerializeField] private RenderTexture renderTex;
    [SerializeField] private string animationName;

    [Header("Render Information")]
    [SerializeField] private AnimationClip animationClip;

    private Animator animator;
    private Texture2D captureTex;

    private bool awaitingFrame;
    private float initialFPS;
    private float currentFPS;
    private float initialFramesInAnimation;
    private float currentFramesInAnimation;
    private int initialWidth;
    private int currentWidth;
    private int initialHeight;
    private int currentHeight;

    private void Awake()
    {
        captureTex = new Texture2D
        (
            renderTex.width,
            renderTex.height,
            TextureFormat.RGBA32,
            false
        );

        initialWidth = renderTex.width;
        currentWidth = initialWidth;
        initialHeight = renderTex.height;
        currentHeight = initialHeight;

        initialFPS = animationClip.frameRate;
        currentFPS = initialFPS;
        initialFramesInAnimation = currentFPS * animationClip.length;
        currentFramesInAnimation = initialFramesInAnimation;

        animator = GetComponent<Animator>();
        animator.speed = 0;
        GoToFrame(80);
    }

    public void GetRenderInformation()
    {
        GoToFrame(0);

        string webpInfo = JsonCompiler.CompileWebpInformation(currentFPS,
                                                              currentFramesInAnimation,
                                                              currentWidth,
                                                              currentHeight,
                                                              CutInManager.currentCutInName + ".webp");
        BeginRendering(webpInfo);
    }

    public void Render()
    {
        IEnumerator RenderEnumerator()
        {
            for (int i = 0; i < currentFramesInAnimation; i++)
            {
                // waits until next frame is called for
                if (i != 0) awaitingFrame = true;
                while (awaitingFrame)
                {

                }

                Debug.Log("awaitingFrame set to false. Rendering next frame.");

                // renders frame
                GoToFrame(i);
                yield return new WaitForEndOfFrame();
                exportCamera.targetTexture = renderTex;
                RenderTexture.active = renderTex;
                exportCamera.Render();
                Debug.Log("Rendering frame " + i);

                // saves the frame to frames array in js
                SaveFrame();
            }

            BeginEncoding();
            //animator.speed = 1;
        }

        StartCoroutine(RenderEnumerator());
    }

    public void GetNextFrame()
    {
        awaitingFrame = false;
    }

    private void SaveFrame()
    {
        captureTex.ReadPixels(new Rect(0, 0, renderTex.width, renderTex.height), 0, 0);

        captureTex.Apply();

        byte[] imageBytes;

        if (currentWidth != renderTex.width)
        {
            imageBytes = ResizeImage(captureTex);
        }
        else
        {
            imageBytes = captureTex.GetRawTextureData<byte>().ToArray();
        }

        GCHandle handle = GCHandle.Alloc(imageBytes, GCHandleType.Pinned);
        try
        {
            IntPtr pointer = handle.AddrOfPinnedObject();
            SendFrameToJS(pointer, imageBytes.Length);
            Debug.Log("Sent frame to JS");
        }
        finally
        {
            handle.Free(); // Always free the handle to avoid memory leaks
        }

        RenderTexture.active = null;
    }

    private byte[] ResizeImage(Texture2D source)
    {
        Debug.Log($"Resizing frame of OG size to {currentWidth}x{currentHeight}");
        RenderTexture tempRt = RenderTexture.GetTemporary(currentWidth, currentHeight);

        Graphics.Blit(source, tempRt);
        RenderTexture.active = tempRt;


        Texture2D resizedTex = new Texture2D(currentWidth, currentHeight, TextureFormat.RGBA32, false);
        resizedTex.ReadPixels(new Rect(0, 0, currentWidth, currentHeight), 0, 0);
        resizedTex.Apply();

        byte[] bytes = resizedTex.GetRawTextureData<byte>().ToArray();

        RenderTexture.active = null;
        RenderTexture.ReleaseTemporary(tempRt);
        Destroy(resizedTex);

        return bytes;
    }

    private void GoToFrame(int index)
    {
        float timeNormalized = (float)index / currentFramesInAnimation;
        Debug.Log("[GoToFrame] New Time = " + timeNormalized);
        timeNormalized += 0.001f; // prevents rounding errors

        Debug.Log($"[GoToFrame] animator.Play({animationName}, 0, {timeNormalized}");
        animator.Play(animationName, 0, timeNormalized);
    }

    public void ChangeFPS(string newFPS)
    {
        float newFPSFloat = float.Parse(newFPS.Substring(0, 2));
        currentFPS = newFPSFloat;

        currentFramesInAnimation = (initialFramesInAnimation / initialFPS) * newFPSFloat;
    }

    public void ChangeSize(string newSize)
    {
        int newSizeInt = int.Parse(newSize.Trim('p'));

        currentHeight = newSizeInt;
        Debug.Log($"New Height: {currentHeight}");
        currentWidth = (int) (initialWidth * ((float)(currentHeight) / initialHeight));
        Debug.Log($"New Width: {currentWidth} = {initialWidth} * ({currentHeight} / {initialHeight})");
    }
}
