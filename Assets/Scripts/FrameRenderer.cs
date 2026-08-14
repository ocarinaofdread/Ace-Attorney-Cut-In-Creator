using System;
using System.Collections;
using System.IO;
using System.Runtime.InteropServices;
using Unity.Collections;
using UnityEngine;

public class FrameRenderer : MonoBehaviour
{
    [DllImport("__Internal")] private static extern void SendImageToJS(IntPtr arrayPointer, int arrayLength);

    [SerializeField] private Camera exportCamera;
    [SerializeField] private RenderTexture renderTex;
    [SerializeField] private string animationName;
    [SerializeField] private int framesInAnimation;

    private Animator animator;
    private Texture2D captureTex;

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

        IEnumerator RenderEnumerator()
        {
            ProgressBar.percentage = 0;
            ProgressBar.message = "Rendering frames...";

            //for (int i = 0; i < framesInAnimation; i++)
            //{
            //    // for each frame
            //    GoToFrame(i);
            //    yield return new WaitForEndOfFrame();
            //    exportCamera.targetTexture = renderTex;
            //    RenderTexture.active = renderTex;

            //    exportCamera.Render();
            //    SaveFrame(i + 1);

            //    ProgressBar.percentage = (i + 1) / (framesInAnimation + 0f);
            //}

            GoToFrame(100);
            yield return new WaitForEndOfFrame();
            exportCamera.targetTexture = renderTex;
            RenderTexture.active = renderTex;

            exportCamera.Render();
            SaveFrame(100);

            animator.speed = 1;
        }

        StartCoroutine(RenderEnumerator());
    }

    private void SaveFrame(int frame)
    {
        captureTex.ReadPixels(new Rect(0, 0, renderTex.width, renderTex.height), 0, 0);

        captureTex.Apply();

        byte[] imageBytes = captureTex.EncodeToPNG();

        GCHandle handle = GCHandle.Alloc(imageBytes, GCHandleType.Pinned);
        try
        {
            IntPtr pointer = handle.AddrOfPinnedObject();
            SendImageToJS(pointer, imageBytes.Length);
        }
        finally
        {
            handle.Free(); // Always free the handle to avoid memory leaks
        }

        //string path = Path.Combine(
        //    Application.dataPath, // "...Assets\"
        //    "Exports" // "...\Exports\"
        //);
        //DirectoryInfo info = Directory.CreateDirectory(path + "\\" + CutInManager.currentCutInName);

        //path = Path.Combine(
        //    info.ToString(), // "...Assets\Exports\%CUT_IN_NAME%\"
        //    $"frame{frame:D4}.png" // "...\frame000X.png"
        //);
        //File.WriteAllBytes(path, png);

        RenderTexture.active = null;
    }
}
