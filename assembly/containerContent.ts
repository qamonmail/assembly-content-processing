// The entry file of your WebAssembly module.

import { SmartBuffer } from "./smartBuffer";

const V1 = 0x01;

export function ContainerPack(
    bodyBytes: Uint8Array,
    nonce: Uint8Array
): Uint8Array {
    return PackV1(bodyBytes, nonce)
}

function PackV1(
    bodyBytes: Uint8Array,
    nonce: Uint8Array
): Uint8Array {

    const buf = SmartBuffer.ofSize(V1 + 2 + nonce.length + bodyBytes.length);
    buf.writeUint8(V1);
    buf.writeBytes16Length(nonce);
    buf.writeBytes(bodyBytes);

    return buf.bytes
}

export function ContainerUnpack(
    data: Uint8Array,
): Uint8Array[] {
    const buf = new SmartBuffer(data);
    const version = buf.readUint8();

    if (version === V1) {
        return UnpackV1(buf, data, version)
    }
    return [new Uint8Array(0)]
}

function UnpackV1(
    buf: SmartBuffer,
    data: Uint8Array,
    version: i32
): Uint8Array[] {

    const nonce = buf.readBytes16Length();
    const bodyBytes = data.slice(version + 2 + nonce.length);

    return [nonce, bodyBytes]
}