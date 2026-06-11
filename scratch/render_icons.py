from PIL import Image, ImageDraw, ImageFont
import os

def draw_icon(output_path, size):
    # 1. 创建透明背景
    image = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    # 2. 算圆角比例 (rx/ry=12 对 64, 约占 18.75% 比例)
    radius = int(size * 0.1875)
    
    # 3. 绘制填充的圆角矩形 (#2563EB -> RGB: 37, 99, 235)
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=radius,
        fill=(37, 99, 235, 255)
    )
    
    # 4. 加载 Arial Bold 字体
    font_size = int(size * 0.38)
    try:
        font = ImageFont.truetype("arialbd.ttf", font_size)
    except IOError:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()
            
    text = "CG"
    # 计算文字的精确包围盒以做中心定位
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) / 2 - bbox[0]
    y = (size - text_height) / 2 - bbox[1]
    
    # 5. 绘制白色文字
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    
    # 6. 覆写保存
    if os.path.exists(output_path):
        os.remove(output_path)
    image.save(output_path, "PNG")
    print(f"Generated {output_path} ({size}x{size})")

# 执行绘制
draw_icon(r"f:\cad tools io\cadtools-cc\public\favicon.png", 64)
draw_icon(r"f:\cad tools io\cadtools-cc\public\icon-192.png", 192)
draw_icon(r"f:\cad tools io\cadtools-cc\public\icon-512.png", 512)

print("All PNG icons generated successfully using PIL!")
