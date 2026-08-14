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
    [SerializeField] private int framesInAnimation;
    [SerializeField] private int framesPerSecond;

    private Animator animator;
    private Texture2D captureTex;

    private bool awaitingFrame;

    private void Awake()
    {
        animator = GetComponent<Animator>();

        captureTex = new Texture2D
        (
            renderTex.width,
            renderTex.height,
            TextureFormat.RGBA32,
            false
        );

        animator.speed = 0;
        GoToFrame(0);
    }

    private void GoToFrame(int index)
    {
        float timeNormalized = (float)index / framesInAnimation;
        timeNormalized += 0.001f; // prevents rounding errors

        animator.Play(animationName, 0, timeNormalized);
    }

    public void Render()
    {
        animator.speed = 0;
        GoToFrame(0);

        string webpInfo = JsonCompiler.CompileWebpInformation(framesPerSecond,
                                                              framesInAnimation,
                                                              renderTex.width,
                                                              renderTex.height,
                                                              CutInManager.currentCutInName + ".webp");
        BeginRendering(webpInfo);

        IEnumerator RenderEnumerator()
        {
            for (int i = 0; i < framesInAnimation; i++)
            {
                // waits until next frame is called for
                if (i != 0) awaitingFrame = true;
                while (awaitingFrame)
                {

                }

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
            animator.speed = 1;
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

        byte[] imageBytes = captureTex.GetRawTextureData<byte>().ToArray();

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
}
